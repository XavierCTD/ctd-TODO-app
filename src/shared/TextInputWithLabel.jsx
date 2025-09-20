import styled from "styled-components";

const StyledLabel = styled.label`
  padding: 20px;
`;

function TextInputWithLabel({
    elementId,
    label,
    onChange,
    ref,
    value,
}) {
    return (
        <>

        <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
        
        <input
          type="text"
          id={elementId}
          ref={ref}
          value={value}
          onChange={onChange}
        />
        </>
    );
};

export default TextInputWithLabel;