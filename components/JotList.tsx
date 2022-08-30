import { FC } from "react";

type JotListProps = {
    jots?: []
}

const JotList: FC<JotListProps> = ({jots = []}) => {

    const isEmpty = jots.length === 0;

    return (
        <article>
            {isEmpty &&
                <p role="note">There are no jots yet!</p>
            }
        </article>
    )
}

export default JotList;