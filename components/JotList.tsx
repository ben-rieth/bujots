import { Jot } from "@prisma/client";
import { FC } from "react";
import JotListItem from "./JotListItem";

type JotListProps = {
    jots?: Jot[]
}

const JotList: FC<JotListProps> = ({jots = []}) => {

    const isEmpty = jots.length === 0;

    return (
        <article>
            {isEmpty &&
                <p role="note">There are no jots yet!</p>
            }

            {jots.map(jot => <JotListItem key={jot.id} jot={jot} />)}
        </article>
    )
}

export default JotList;