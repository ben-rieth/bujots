
import { User } from "@prisma/client";
import JotList from "components/jots/JotList";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import JotInput from "components/jots/forms/JotInput";

type JotPageProps = {
    user: User
}

const JotPage:FC<JotPageProps> = ({ user }) => {

    const [days, setDays] = useState<number>(7);
    const lists = [];

    for(let i = 0; i < days; i++) {
        lists.push(<JotList daysAgo={i} key={`list-${i}`}/>)
    }

    const loadMoreHandler = () => {
        setDays(days + 7)
    }

    return (
        <>
            <InfiniteScroll
                next={loadMoreHandler}
                loader={<h3>Loading</h3>}
                hasMore={days < 16}
                dataLength={lists.length}
            >
                {lists}
            </InfiniteScroll>
            <JotInput />
        </>
        
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: session.user
        }
    }



}

export default JotPage;