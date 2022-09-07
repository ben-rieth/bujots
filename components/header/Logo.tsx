import { IoJournal } from "react-icons/io5"

const Logo = () => {
    return (
        <div className="flex items-center">
            <IoJournal className="w-7 h-7 fill-sky-500"/>
            <h1 className="text-3xl italic font-bold text-sky-500">
                BuJots
            </h1>
        </div>
    )
}

export default Logo;