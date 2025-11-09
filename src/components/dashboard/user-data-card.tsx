import Image from "next/image";
export type UserDataProps = {
    name: string;
    email: string;
    //image: unknown;
    time: string;
}

export default function UserDataCard(props: UserDataProps) {
    const defaultImage = "/images/user-icon.jpg"
    return (
        <div className="flex flex-wrap justify-between gap-3">
            <section className="flex justify-between gap-3">
                <div className="h-12 w-12rounded-full">
                    <Image width={300} height={300} src={defaultImage}//props.image ||
                        alt="avatar" className="rounded-full h-12 w-12"></Image>
                </div>
                <div className="text-sm">
                    <p>{props.name}</p>
                    <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120] sm:w-auto 
                        opacity-30">
                        {props.email}
                    </div>
                </div>
            </section>
            <p className="text-sm">{props.time}</p>
        </div>
    )

}