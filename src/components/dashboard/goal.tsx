import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress"

export type GoalProps = {
    bar: number
    goal: number
    value: number
}
export default function GoalDataCard(props: GoalProps) {
    return (
        <div className="bg-slate-100/70 rounded-[6px] p-5">
            <section className="flex justify-between gap-2 pb-2">
                <p>Progress</p>
                <Target className="h-4 w-4" />
            </section>
            <div className="gap-3 pt-2">
                <section className="flex justify-between gap-3">
                    <div className="w-full rounded-full">
                        <Progress value={props.bar} className="border border-black/10 bg-slate-100/20 h-2"></Progress>
                    </div>
                </section>
                <div className="flex justify-between text-sm opacity-50 pt-3">
                    <p>{props.value} Kr</p>
                    <p>Mål: {props.goal} Kr</p>
                </div>

            </div>

        </div>
    )
}