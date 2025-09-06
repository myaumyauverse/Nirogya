import Image from "next/image";

type ButtonProps={
    type: 'button' | 'submit';
    title: string;
    icon?: string;
    variant: string

}
const Button = ({type,title,icon,variant}: ButtonProps) => {
  return (
    <button type={type}
    className={`flexCenter gap-3 rounded-xl ${variant} transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg`}>
        {icon && <Image src={icon} alt={title} width={24} height={24}/> }
        <label className="bold-16 whitespace-nowrap cursor-pointer">{title}</label>
    </button>
  )
}

export default Button
