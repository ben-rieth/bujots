import { Jot, Status, Type } from "@prisma/client";
import axios from "axios";
import { FC, useState } from "react";
import { IoEllipseOutline, IoTriangleOutline, IoRemove, IoTriangle, IoEllipse } from 'react-icons/io5';
import { useSWRConfig } from "swr";
import JotForm from "./JotForm";

type JotListItemProps = {
    jot: Jot
}

const JotListItem : FC<JotListItemProps> = ({jot}) => {
    const { mutate } = useSWRConfig();

    const [formVisible, setFormVisible] = useState<boolean>(false);

    const openForm = () => setFormVisible(true);
    const closeForm = () => setFormVisible(false);

    const updateJot = async (values: Partial<Jot>) => {
        await axios.patch(`/api/jots/${jot.id}`, values);
        mutate('/api/jots')
    }

    const getJotIcon = () => {
        let icon = null;
        if (jot.type === Type.NOTE) {
            icon = <IoRemove data-testid="dash"  className="w-6 h-6"/>

        } else if (jot.type === Type.EVENT && jot.status !== Status.COMPLETED) {
            icon = <IoTriangleOutline data-testid="triangle-filled" className="w-6 h-6"/>;

        } else if (jot.type === Type.EVENT && jot.status === Status.COMPLETED) {
            icon = <IoTriangle data-testid="triangle-outline" className="w-6 h-6"/>;

        } else if (jot.type === Type.TASK && jot.status !== Status.COMPLETED) {
            icon = <IoEllipseOutline data-testid="circle-outline" className="w-6 h-6"/>;

        } else if (jot.type === Type.TASK && jot.status === Status.COMPLETED) {
            icon = <IoEllipse data-testid="circle-filled" className="w-6 h-6"/>;
        }

        return icon;
    }

    return (
        !formVisible ? (
            <p 
                className="flex items-center gap-1 w-fit w-max-{15rem} py-1" 
                role="note" 
                onClick={openForm}
            >
                {getJotIcon()}
                <span className="">
                    {jot.content}
                </span>
            </p>
        ) : (
            <JotForm 
                onSubmit={updateJot}
                done={closeForm}
                initialValues={{
                    content: jot.content,
                    status: jot.status,
                    important: jot.important,
                    type: jot.type
                }}
            />
        )
    )
}

export default JotListItem;