import Image from "next/image";

type ButtonProps={
    type: 'button' | 'submit';
    title: string;
    icon?: string;
    variant: string;
    onClick?: () => void;
    disabled?: boolean;
    full?: boolean;
}

const Button = ({type, title, icon, variant, onClick, disabled, full}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flexCenter gap-3 rounded-xl ${variant} ${full ? 'w-full' : ''} transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon && <Image src={icon} alt={title} width={24} height={24}/> }
        <label className="bold-16 whitespace-nowrap cursor-pointer">{title}</label>
    </button>
  )
}

export default Button
