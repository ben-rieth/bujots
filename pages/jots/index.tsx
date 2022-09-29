
import { User } from "@prisma/client";
import DailyList from "components/jots/DailyList";
import JotList from "components/jots/JotList";
import { startOfTomorrow } from "date-fns";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

type JotPageProps = {
    user: User
}

const JotPage:FC<JotPageProps> = ({ user }) => {

    return (
        <DailyList date={startOfTomorrow()}/>
    )

    // const [days, setDays] = useState<number>(7);
    // const lists = [];

    // for(let i = 0; i < days; i++) {
    //     lists.push(<JotList daysAgo={i} key={`list-${i}`}/>)
    // }

    // const loadMoreHandler = () => {
    //     setDays(days + 7)
    // }

    // return (
    //     <InfiniteScroll
    //         next={loadMoreHandler}
    //         loader={<h3>Loading</h3>}
    //         hasMore={days < 16}
    //         dataLength={lists.length}
    //     >
    //         {lists}
    //     </InfiniteScroll>
        
    // )
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