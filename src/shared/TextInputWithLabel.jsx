import styled from "styled-components";

const StyledLabel = styled.label`
  padding: 20px;
`

function TextInputWithLabel({
    elemnetId,
    label,
    onChange,
    ref,
    value,
}) {
    return (
        <>
        <StyledLabel htmlFor={elemnetId}>{label}</StyledLabel>
        <input
          type="text"
          id={elemnetId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
        </>
    );
};

export default TextInputWithLabel;