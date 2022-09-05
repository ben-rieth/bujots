import { Jot, Status, Type } from "@prisma/client";
import axios from "axios";
import { FC, useState } from "react";
import { IoEllipseOutline, IoTriangleOutline, IoRemove, IoTriangle, IoEllipse, IoArrowForwardCircle } from 'react-icons/io5';
import { useSWRConfig } from "swr";
import JotForm from "./JotForm";

type JotListItemProps = {
    jot: Jot,
    isToday: boolean,
    onMigrate: () => void
}

const JotListItem : FC<JotListItemProps> = ({jot, isToday, onMigrate }) => {
    const { mutate } = useSWRConfig();

    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [internalJot, setInternalJot] = useState<Jot>(jot);
    const [complete, setComplete] = useState<boolean>(jot.status === Status.COMPLETED);

    const handleTextClick = () => {
        if (!isToday || complete) return

        setFormVisible(true);
    }

    const handleIconClick = () => {
        if(isToday) {
            toggleComplete()
        }
    }

    const toggleComplete = async () => {
        if (jot.status === Status.DELETED) return;

        const newStatus = jot.status === Status.COMPLETED ? Status.ACTIVE : Status.COMPLETED;

        setComplete(!complete);

        await axios.patch(`/api/jots/${jot.id}`, { status: newStatus });
        mutate('/api/jots')
    }

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

    const getJotIcon = (jot: Jot) => {
        let icon = null;
        if (jot.type === Type.NOTE) {
            icon = <IoRemove data-testid="dash"  className="w-6 h-6"/>

        } else if (jot.type === Type.EVENT && !complete) {
            icon = <IoTriangleOutline 
                        data-testid="triangle-outline" 
                        className="w-6 h-6"
                        onClick={handleIconClick}
                    />;

        } else if (jot.type === Type.EVENT && complete) {
            icon = <IoTriangle 
                        data-testid="triangle-filled" 
                        className="w-6 h-6"
                        onClick={handleIconClick}
                    />;

        } else if (jot.type === Type.TASK && !complete) {
            icon = <IoEllipseOutline 
                        data-testid="circle-outline" 
                        className="w-6 h-6"
                        onClick={handleIconClick}
                    />;

        } else if (jot.type === Type.TASK && complete) {
            icon = <IoEllipse 
                        data-testid="circle-filled" 
                        className="w-6 h-6"
                        onClick={handleIconClick}
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
                        leading-none
                        ${complete && "text-green-500"}
                        ${internalJot.status === Status.DELETED && "line-through"}
                        ${(internalJot.important && internalJot.status !== "DELETED") 
                            && "underline decoration-rose-500 underline-offset-2 decoration-2 font-bold"}
                    `}
                    onClick={handleTextClick}
                    data-testid="content"
                >
                    {internalJot.content}
                </span>
                {(!isToday && !complete && jot.type !== "NOTE") &&
                    <IoArrowForwardCircle 
                        onClick={onMigrate}
                        data-testid="arrow" 
                        className="w-6 h-6 fill-sky-500"/>
                }

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