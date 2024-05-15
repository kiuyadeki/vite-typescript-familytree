import { FC, memo, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useProfilePictureUpload } from "../../hooks/useProfilePictureChange";
import { useRecoilState, useRecoilValue } from "recoil";
import { wholeNodesState } from "../../recoil/WholeNodesState";
import { nodesUpdatedState } from "../../recoil/nodesUpdatedState";
import { selectedNodeState } from "../../recoil/selectedNodeState";
import styled from "styled-components";
import { IoChevronDown } from "react-icons/io5";

type Inputs = {
  lastName: string;
  firstName: string;
  birthYear: number;
  birthMonth: number;
  birthDate: number;
  gender: string;
  profilePicture: any;
  profilePictureURL: any;
};

type ProfileEditorProps = {
  setShowProfileEditor: (value: boolean) => void;
  onClose: () => void;
};

export const ProfileEditor: FC<ProfileEditorProps> = memo(props => {
  const { setShowProfileEditor, onClose } = props;
  const selectedNode = useRecoilValue(selectedNodeState);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Inputs>();
  const { uploadedImage, handleImageChange } = useProfilePictureUpload();
  const [wholeNodes, setWholeNodes] = useRecoilState(wholeNodesState);
  const [nodesUpdated, setNodesUpdated] = useRecoilState(nodesUpdatedState);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ファイルが選択されたときにreact-hook-formの値を更新
  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(event);
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewImageURL(previewURL);
    } else {
      setPreviewImageURL(null);
    }
    setValue("profilePicture", file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const onSubmit = handleSubmit(data => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          lastName: data.lastName,
          firstName: data.firstName,
          birthYear: data.birthYear,
          birthMonth: data.birthMonth,
          birthDate: data.birthDate,
          gender: data.gender,
          profilePicture: data.profilePicture,
          profilePictureURL: data.profilePicture instanceof File ? URL.createObjectURL(data.profilePicture) : null,
        },
      };
      setWholeNodes(prevNodes =>
        prevNodes.map(node => {
          return node.id === selectedNode.id ? updatedNode : node;
        })
      );
    }
    onClose();
    setShowProfileEditor(false);
    setNodesUpdated(true);
  });

  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);
  interface Gender {
    label: string;
    value: string;
  }
  const genders: Gender[] = [
    {
      label: "男性",
      value: "male",
    },
    {
      label: "女性",
      value: "female",
    },
    {
      label: "その他",
      value: "",
    },
  ];

  useEffect(() => {
    if (selectedNode && selectedNode.data) {
      const { lastName, firstName, birthYear, birthMonth, birthDate, gender, profilePicture } = selectedNode.data;
      setValue("lastName", lastName || "");
      setValue("firstName", firstName || "");
      setValue("birthYear", birthYear || new Date().getFullYear());
      setValue("birthMonth", birthMonth || 1);
      setValue("birthDate", birthDate || 1);
      setSelectedGender(gender);
      if (profilePicture) {
        setValue("profilePicture", profilePicture || "");
        const previewURL = typeof profilePicture === "string" ? profilePicture : URL.createObjectURL(profilePicture);
        setPreviewImageURL(previewURL);
      }
    }
  }, [selectedNode, setValue]);

  const HorizontalBox = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem;
  `;

  const FormControl = styled.div`
    width: 100%;
    position: relative;
  `;

  interface FormLabelProps {
    mt?: number;
    isLoading?: () => void;
  }
  const FormLabel = styled.label<FormLabelProps>`
    margin-top: ${props => props.mt || 0}px;
    display: block;
    text-align: start;
    font-size: 1rem;
    margin-inline-end: 0.75rem;
    margin-block-end: 0.5rem;
    font-weight: 500;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    opacity: 1;
  `;

  const TextInput = styled.input`
    width: 100%;
    height: 2.5rem;
    font-size: 1rem;
    padding-inline: 1rem;
    padding-block: 0;
    border-radius: 0.375rem;
    min-width: 0px;
    position: relative;
    appearance: none;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    border: 1px solid #e2e8f0;
    margin: 0;
    box-sizing: border-box;
  `;

  const RadioBox = styled.label`
    display: inline-flex;
    align-items: center;
    vertical-align: top;
    cursor: pointer;
    position: relative;
  `;

  const RadioInput = styled.input.attrs({ type: "radio" })`
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0px;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0;
  `;

  const RadioText = styled.span`
    user-select: none;
    margin-inline-start: 0.5rem;
    font-size: 1rem;
  `;

  const RadioControl = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    transition-property: box-shadow;
    transition-duration: 200ms;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    border-color: #e2e8f0;
    color: #fff;

    ${RadioInput}:checked + & {
      background-color: #3182ce;
      border-color: #3182ce;
      color: #fff;

      &::before {
        content: "";
        display: inline-block;
        position: relative;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        background: currentcolor;
      }
    }
  `;

  const SelectWrapper = styled.div`
    width: 100%;
    height: fit-content;
    position: relative;
  `;

  const SelectInput = styled.select`
    padding-inline: 1rem 2rem;
    width: 100%;
    height: 2.5rem;
    font-size: 1rem;
    border-radius: 0.375rem;
    min-width: 0px;
    position: relative;
    appearance: none;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    padding-bottom: 1px;
    line-height: normal;
    background: inherit;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    border-color: #e2e8f0;
    cursor: pointer;
  `;

  const SelectIcon = styled(IoChevronDown)`
    position: absolute;
    right: 0.7rem;
    top: 0;
    bottom: 0;
    margin: auto;
    pointer-events: none;
  `;

  const HiddenInput = styled.input.attrs({ type: "file" })`
    display: none;
    visibility: hidden;
    appearance: none;
  `;

  interface StyledButtonProps {
    marginTop?: string;
  }
  const StyledButton = styled.button<StyledButtonProps>`
    display: flex;
    appearance: none;
    align-items: center;
    justify-content: center;
    position: relative;
    white-space: nowrap;
    line-height: 1.2;
    border-radius: 0.375rem;
    font-weight: 600;
    border: none;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    height: 2.5rem;
    min-width: 2.5rem;
    font-size: 1rem;
    padding-inline: 1rem;
    background: #edf2f7;
    color: #1a202c;
    cursor: pointer;
    margin-top: ${props => props.marginTop || "0"};
  `;

  const ImageFrame = styled.figure`
    max-width: 10rem;
    width: 100%;
    aspect-ratio: 1;
    margin-block: 20px;
    margin-inline: 0;
  `;

  const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid rgb(237, 242, 247);
  `;

  const ErrorMessage = styled.div`
    display: flex;
    align-items: center;
    color: #e53e3e;
    margin-top: 0.5rem;
    font-size: 0.875rem;
  `;

  return (
    <form onSubmit={onSubmit}>
      <HorizontalBox>
        <FormControl>
          <FormLabel htmlFor="lastName">姓</FormLabel>
          <TextInput type="text" id="lastName" placeholder="姓" {...register("lastName")} />
          <ErrorMessage>{errors.lastName && errors.lastName.message}</ErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="firstName">名</FormLabel>
          <TextInput type="text" id="firstName" placeholder="名" {...register("firstName")} />
          <ErrorMessage>{errors.firstName && errors.firstName.message}</ErrorMessage>
        </FormControl>
      </HorizontalBox>
      <FormLabel mt={24}>性別</FormLabel>
      <HorizontalBox>
        {genders.map(gender => (
          <RadioBox>
            <RadioInput value={gender.value} {...register("gender")} />
            <RadioControl></RadioControl>
            <RadioText>{gender.label}</RadioText>
          </RadioBox>
        ))}
      </HorizontalBox>
      <FormLabel mt={24}>生年月日</FormLabel>
      <HorizontalBox>
        <FormControl>
          <SelectWrapper>
            <SelectInput {...register("birthYear")}>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectInput>
            <SelectIcon size={16} color="#1a202c" />
          </SelectWrapper>
        </FormControl>
        <FormControl>
          <SelectWrapper>
            <SelectInput placeholder="月" {...register("birthMonth")}>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </SelectInput>
            <SelectIcon size={16} color="#1a202c" />
          </SelectWrapper>
        </FormControl>
        <FormControl>
          <SelectWrapper>
            <SelectInput placeholder="日" {...register("birthDate")}>
              {dates.map(date => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </SelectInput>
            <SelectIcon size={16} color="#1a202c" />
          </SelectWrapper>
        </FormControl>
      </HorizontalBox>
      <FormControl>
        <FormLabel mt={24}>写真</FormLabel>
        <HiddenInput
          accept="image/*"
          {...register("profilePicture", {
            onChange: onFileInputChange,
          })}
          ref={inputRef}
        />
        <StyledButton type="button" onClick={handleButtonClick}>
          {previewImageURL ? "写真を変更" : "写真を選択"}
        </StyledButton>
        {previewImageURL && (
          <ImageFrame>
            <Image src={previewImageURL} />
          </ImageFrame>
        )}
        {uploadedImage && !previewImageURL && (
          <ImageFrame>
            <Image src={uploadedImage} />
          </ImageFrame>
        )}
      </FormControl>

      <StyledButton marginTop="20px" type="submit">
        保存する
      </StyledButton>
    </form>
  );
});
