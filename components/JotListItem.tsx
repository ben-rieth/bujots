import { Jot, Type } from "@prisma/client";
import { FC } from "react";
import { IoEllipseOutline, IoTriangleOutline, IoRemove } from 'react-icons/io5';

type JotListItemProps = {
    jot: Jot
}

const JotListItem : FC<JotListItemProps> = ({jot}) => {

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
        <p className="flex items-center gap-1">
            {jotIcon}
            <span className="text-lg">
                {jot.content}
            </span>
        </p>
    )
}

export default JotListItem;