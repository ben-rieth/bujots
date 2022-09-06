import { Jot } from "@prisma/client";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoArrowForwardCircle } from "react-icons/io5";
import { useSWRConfig } from "swr";

type MigrateIconProps = {
    jot: Jot,
    isToday: boolean
    onMigrate: () => void
}

const MigrateIcon : FC<MigrateIconProps> = ({ jot, isToday, onMigrate }) => {

    console.log('render')
    const { mutate } = useSWRConfig();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const canMigrate = !isToday 
                        && jot.type !== "NOTE" 
                        && jot.status === "ACTIVE" 
                        && !isLoading

    const migrateJot = async () => {
        setIsLoading(true)
        await axios.patch(`api/jots/${jot.id}?migrate=true`)
        mutate('/api/jots');
        onMigrate()
    }

    if (canMigrate) {
        return (
            <IoArrowForwardCircle 
                className="w-6 h-6 fill-sky-500"
                onClick={migrateJot}
            />
        )
    } else if (isLoading) {
        return (
            <AiOutlineLoading3Quarters 
                className="w-6 h-6 fill-sky-500 animate-spin"
            />
        )
    } else {
        return null;
    }
    
}

export default MigrateIcon;