import { Jot, Status, Type } from "@prisma/client";
import axios from "axios";
import { FC, useState } from "react";
import { useSWRConfig } from "swr";
import JotForm from "./JotForm";
import JotIcon from "./JotIcon";
import MigrateIcon from "./MigrateIcon";

type JotListItemProps = {
    jot: Jot,
    isToday?: boolean
}

const JotListItem : FC<JotListItemProps> = ({jot, isToday=false }) => {
    const { mutate } = useSWRConfig();

    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [internalJot, setInternalJot] = useState<Jot>(jot);

    const [migrated, setMigrated] = useState<boolean>(false);

    const openForm = () => setFormVisible(true);
    const closeForm = () => setFormVisible(false);

    const updateJot = async (values: Partial<Jot>) => {

        const oldJotValues = internalJot;
        setInternalJot({...internalJot, ...values});
        
        await axios.patch(`/api/jots/${jot.id}`, values)
            .catch((error) => {
                setInternalJot(oldJotValues)
                throw new Error(error);
            });
        mutate('/api/jots')
    }

    const toggleComplete = async () => {
        if (internalJot.status === Status.DELETED) return;

        const newStatus = internalJot.status === Status.COMPLETED ? Status.ACTIVE : Status.COMPLETED;

        setInternalJot({
            ...internalJot,
            status: newStatus
        });

        await axios.patch(`/api/jots/${jot.id}`, { status: newStatus });
        mutate('/api/jots')
    }

    if (migrated) {
        return null;
    }

    return (
        !formVisible ? (
            <article className="flex items-center gap-1 py-1" >
                <JotIcon jot={internalJot} onClick={toggleComplete} />
                <span 
                    className={`
                        flex-auto 
                        ${internalJot.status === Status.COMPLETED && "text-green-500"}
                        ${internalJot.status === Status.DELETED && "line-through"}
                        ${(internalJot.important && internalJot.status !== "DELETED") 
                            && "underline decoration-rose-500 underline-offset-2 decoration-2 font-bold"}
                    `}
                    onClick={openForm}
                    data-testid="content"
                >
                    {internalJot.content}
                </span>


                <MigrateIcon 
                    jot={internalJot} 
                    isToday={isToday}
                    onMigrate={() => setMigrated(true)} />
            </article>
        ) : (
            <JotForm 
                onSubmit={updateJot}
                done={closeForm}
                initialValues={{
                    content: internalJot.content,
                    status: internalJot.status,
                    important: internalJot.important,
                    type: internalJot.type
                }}
            />
        )
    )
}

export default JotListItem;