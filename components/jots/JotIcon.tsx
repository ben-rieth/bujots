import { Jot, Type } from "@prisma/client";
import { FC } from "react";
import { IoEllipse, IoEllipseOutline, IoRemove, IoTriangle, IoTriangleOutline } from "react-icons/io5";

type JotIconProps = {
    jot: Jot
    onClick: () => void
}

const JotIcon : FC<JotIconProps> = ({ jot, onClick }) => {
    const iconClasses = "w-6 h-6";

    let icon = null;

    if (jot.type === Type.NOTE) {
        icon = <IoRemove 
                    data-testid="dash"  
                    className={iconClasses}
                />

    } else if (jot.type === Type.EVENT && jot.status !== "COMPLETED") {
        icon = <IoTriangleOutline 
                    data-testid="triangle-outline" 
                    className={iconClasses}
                    onClick={onClick}
                />;

    } else if (jot.type === Type.EVENT && jot.status === "COMPLETED") {
        icon = <IoTriangle 
                    data-testid="triangle-filled" 
                    className={iconClasses}
                    onClick={onClick}
                />;

    } else if (jot.type === Type.TASK && jot.status !== "COMPLETED") {
        icon = <IoEllipseOutline 
                    data-testid="circle-outline" 
                    className={iconClasses}
                    onClick={onClick}
                />;

    } else if (jot.type === Type.TASK && jot.status === "COMPLETED") {
        icon = <IoEllipse 
                    data-testid="circle-filled" 
                    className={iconClasses}
                    onClick={onClick}
                />;
    } 

    return (
        <>
            {icon}
        </>
    )
}

export default JotIcon;