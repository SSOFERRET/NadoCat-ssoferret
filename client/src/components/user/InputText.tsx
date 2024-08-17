import React, {ForwardedRef} from "react";
import "../../styles/scss/components/user/inputText.scss";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement>{
    placeholder?: string;
    inputType?: "text" | "email" | "password" | "number";
}

const InputText = React.forwardRef(({placeholder, inputType = "text", onChange, ...props}: InputTextProps,
    ref: ForwardedRef<HTMLInputElement>) => {
    return (
        <input placeholder={placeholder} ref={ref} type={inputType} onChange={onChange} {...props} />
    );
});

export default InputText;