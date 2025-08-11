function TextInputWithLabel({
    elemnetId,
    label,
    onChange,
    ref,
    value,
}) {
    return (
        <>
        <label htmlFor={elemnetId}>{label}</label>
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