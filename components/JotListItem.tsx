import { Jot, Type } from "@prisma/client";
import useDetectOutsideClick from "hooks/useDetectOutsideClick";
import { FC, useRef, useState } from "react";
import { IoEllipseOutline, IoTriangleOutline, IoRemove } from 'react-icons/io5';
import { RiDeleteBinLine, RiEditLine, RiCheckboxCircleFill } from 'react-icons/ri';

type JotListItemProps = {
    jot: Jot
}

const JotListItem : FC<JotListItemProps> = ({jot}) => {

    const [buttonsVisible, setButtonsVisible] = useState<boolean>(false);

    const clickHandler = () => {
        setButtonsVisible(true);
    }

    const outsideClickHandler = () => {
        setButtonsVisible(false)
    }

    const ref = useRef(null);
    useDetectOutsideClick(ref, outsideClickHandler);

    let jotIcon;
    switch(jot.type) {
        case(Type.EVENT):
            jotIcon = <IoTriangleOutline data-testid="triangle-outline" className="w-6 h-6"/>
            break;
        case(Type.TASK):
            jotIcon = <IoEllipseOutline data-testid="circle-outline" className="w-6 h-6"/>
            break;
        case(Type.NOTE):
        default:
            jotIcon = <IoRemove data-testid="dash"  className="w-6 h-6"/>
            break;
    }

    return (
        <div className="py-1">
            <p className="flex items-center gap-1 w-fit w-max-{15rem}" role="note" ref={ref} onClick={clickHandler}>
                {jotIcon}
                <span className="">
                    {jot.content}
                </span>

                
            </p>
            {buttonsVisible &&
                <div className="flex gap-2 pl-7">
                    <RiCheckboxCircleFill data-testid="complete" className="w-7 h-7 fill-green-500" />
                    <RiEditLine data-testid='update' className="w-7 h-7 fill-sky-500"/>
                    <RiDeleteBinLine data-testid='delete' className="w-7 h-7 fill-rose-500"/>
                </div>
            }
        </div>
    )
}

export default JotListItem;