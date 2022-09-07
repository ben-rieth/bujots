
import JotList from "components/jots/JotList";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const JotPage = () => {

    const [days, setDays] = useState<number>(7);
    const lists = [];

    for(let i = 0; i < days; i++) {
        lists.push(<JotList daysAgo={i} key={`list-${i}`}/>)
    }

    const loadMoreHandler = () => {
        setDays(days + 7)
    }

    return (
        <InfiniteScroll
            next={loadMoreHandler}
            loader={<h3>Loading</h3>}
            hasMore={days < 16}
            dataLength={lists.length}
        >
            {lists}
        </InfiniteScroll>
        
    )
}

export default JotPage;