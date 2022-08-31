import { Jot, Type } from "@prisma/client";
import useDetectOutsideClick from "hooks/useDetectOutsideClick";
import { FC, useRef, useState } from "react";
import { IoEllipseOutline, IoTriangleOutline, IoRemove } from 'react-icons/io5';
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri';

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
            jotIcon = <IoTriangleOutline data-testid="triangle-outline"/>
            break;
        case(Type.TASK):
            jotIcon = <IoEllipseOutline data-testid="circle-outline"/>
            break;
        case(Type.NOTE):
        default:
            jotIcon = <IoRemove data-testid="dash"/>
            break;
    }

    return (
        <p className="flex items-center gap-1 w-fit" role="note" ref={ref} onClick={clickHandler}>
            {jotIcon}
            <span className="text-lg">
                {jot.content}
            </span>

            {buttonsVisible &&
                <>
                    <RiEditLine data-testid='update' className="w-6 h-6 fill-sky-500"/>
                    <RiDeleteBinLine data-testid='delete' className="w-6 h-6 fill-rose-500"/>
                </>
            }
        </p>
    )
}

export default JotListItem;