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
    const [internalJot, setInternalJot] = useState<Jot>(jot);
    const [complete, setComplete] = useState<boolean>(jot.status === Status.COMPLETED);

    const openForm = () => setFormVisible(true);
    const closeForm = () => setFormVisible(false);

    const updateJot = async (values: Partial<Jot>) => {
        const oldJotValues = internalJot;
        setInternalJot({...internalJot, ...values});
        closeForm();
        
        await axios.patch(`/api/jots/${jot.id}`, values)
            .catch((error) => {
                setInternalJot(oldJotValues)
                throw new Error(error);
            });
        mutate('/api/jots')
    }

    const toggleComplete = async () => {
        if (jot.status === Status.DELETED) return;

        const newStatus = jot.status === Status.COMPLETED ? Status.ACTIVE : Status.COMPLETED;

        setComplete(!complete);

        await axios.patch(`/api/jots/${jot.id}`, { status: newStatus });
        mutate('/api/jots')
    }

    const getJotIcon = (jot: Jot) => {
        let icon = null;
        if (jot.type === Type.NOTE) {
            icon = <IoRemove data-testid="dash"  className="w-6 h-6"/>

        } else if (jot.type === Type.EVENT && !complete) {
            icon = <IoTriangleOutline 
                        data-testid="triangle-outline" 
                        className="w-6 h-6"
                        onClick={toggleComplete}
                    />;

        } else if (jot.type === Type.EVENT && complete) {
            icon = <IoTriangle 
                        data-testid="triangle-filled" 
                        className="w-6 h-6"
                        onClick={toggleComplete}
                    />;

        } else if (jot.type === Type.TASK && !complete) {
            icon = <IoEllipseOutline 
                        data-testid="circle-outline" 
                        className="w-6 h-6"
                        onClick={toggleComplete}
                    />;

        } else if (jot.type === Type.TASK && complete) {
            icon = <IoEllipse 
                        data-testid="circle-filled" 
                        className="w-6 h-6"
                        onClick={toggleComplete}
                    />;
        }

        return icon;
    }

    return (
        !formVisible ? (
            <article className="flex items-center gap-1 py-1" >
                {getJotIcon(internalJot)}
                <span 
                    className={`
                        flex-auto 
                        ${complete && "text-green-500"}
                        ${internalJot.status === Status.DELETED && "line-through"}
                        ${(internalJot.important && internalJot.status !== "DELETED") 
                            && "underline decoration-rose-500 underline-offset-2 decoration-2 font-bold"}
                    `}
                    onClick={openForm}
                    data-testid="content"
                >
                    {internalJot.content}
                </span>
            </article>
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