import { Jot, Status, Type } from "@prisma/client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FC, useState } from "react";
import { useSWRConfig } from "swr";
import JotForm from "./JotForm";
import JotIcon from "./JotIcon";
import MigrateIcon from "./MigrateIcon";

type JotListItemProps = {
    jot: Jot,
    date: Date
}

const JotListItem:FC<JotListItemProps> = ({ jot, date}) => {

    const queryClient = useQueryClient();

    const completeJotMutation = useMutation(
        (newStatus: Status) => axios.patch(`/api/jots/${jot.id}`, { status: newStatus }),
        {
            onMutate: async (newStatus: Status) => {
                await queryClient.cancelQueries(['jots', date])

                const previousJots = queryClient.getQueryData<Jot[]>(['jots', date]);

                if (previousJots) {
                    
                    queryClient.setQueryData<Jot[]>(['jots', date], 
                        previousJots.map((j) => {
                            if (j.id !== jot.id) return j;
                            else return {...j, status: newStatus}
                        })
                    )
                }

                return { previousJots };
            },

            onError: (_err, _variables, context) => {
                if (context?.previousJots) {
                    queryClient.setQueryData<Jot[]>(['jots', date], context.previousJots)
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries(['jots', date])
            }
        }
    );

    const toggleComplete = () => {
        const newStatus = jot.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
        completeJotMutation.mutate(newStatus);
    }

    return (
        <article className="flex items-center gap-1 py-1">
            <JotIcon jot={jot} onClick={toggleComplete} />
                <span 
                    className={`
                        flex-auto 
                        ${jot.status === Status.COMPLETED && "text-green-500"}
                        ${jot.status === Status.DELETED && "line-through"}
                        ${(jot.important && jot.status !== "DELETED") 
                            && "underline decoration-rose-500 underline-offset-2 decoration-2 font-bold"}
                    `}
                    data-testid="content"
                >
                    {jot.content}
                </span>
        </article>
    )
}

// const JotListItem : FC<JotListItemProps> = ({jot, isToday=false }) => {
//     const { mutate } = useSWRConfig();

//     const [formVisible, setFormVisible] = useState<boolean>(false);
//     const [internalJot, setInternalJot] = useState<Jot>(jot);

//     const [migrated, setMigrated] = useState<boolean>(false);

//     const openForm = () => {
//         if(isToday) {
//             setFormVisible(true)
//         }
//     };

//     const closeForm = () => setFormVisible(false);

//     const updateJot = async (values: Partial<Jot>) => {

//         const oldJotValues = internalJot;
//         setInternalJot({...internalJot, ...values});
        
//         await axios.patch(`/api/jots/${jot.id}`, values)
//             .catch((error) => {
//                 setInternalJot(oldJotValues)
//                 throw new Error(error);
//             });
//         mutate('/api/jots')
//     }

//     const toggleComplete = async () => {
//         if(!isToday) return
//         if (internalJot.status === Status.DELETED) return;

//         const newStatus = internalJot.status === Status.COMPLETED ? Status.ACTIVE : Status.COMPLETED;

//         setInternalJot({
//             ...internalJot,
//             status: newStatus
//         });

//         await axios.patch(`/api/jots/${jot.id}`, { status: newStatus });
//         mutate('/api/jots')
//     }

//     if (migrated) {
//         return null;
//     }

//     return (
//         !formVisible ? (
//             <article className="flex items-center gap-1 py-1" >
//                 <JotIcon jot={internalJot} onClick={toggleComplete} />
//                 <span 
//                     className={`
//                         flex-auto 
//                         ${internalJot.status === Status.COMPLETED && "text-green-500"}
//                         ${internalJot.status === Status.DELETED && "line-through"}
//                         ${(internalJot.important && internalJot.status !== "DELETED") 
//                             && "underline decoration-rose-500 underline-offset-2 decoration-2 font-bold"}
//                     `}
//                     onClick={openForm}
//                     data-testid="content"
//                 >
//                     {internalJot.content}
//                 </span>


//                 <MigrateIcon 
//                     jot={internalJot} 
//                     isToday={isToday}
//                     onMigrate={() => setMigrated(true)} />
//             </article>
//         ) : (
//             <JotForm 
//                 onSubmit={updateJot}
//                 done={closeForm}
//                 initialValues={{
//                     content: internalJot.content,
//                     status: internalJot.status,
//                     important: internalJot.important,
//                     type: internalJot.type
//                 }}
//             />
//         )
//     )
// }

export default JotListItem;