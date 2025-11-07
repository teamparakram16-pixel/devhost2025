
import { axiosClient } from "@/lib/axiosClient";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { base_price, days_old, demand_level, input_date } = payload;

        const URL = process.env.NEXT_PUBLIC_HF_SPACE_MODEL;

        if (!URL) {
            return NextResponse.json(
                { error: "Model URL not configured" },
                { status: 500 }
            );
        }

        const modelInput: Record<string, any> = {
            base_price,
            demand_level,
        };

        if (days_old === undefined && !input_date) {
            return NextResponse.json(
                { error: "Either days_old or input_date must be provided" },
                { status: 400 }
            );
        }

        if (days_old !== undefined && days_old !== null) {
            modelInput.days_old = days_old;
        } else if (input_date) {
            modelInput.input_date = input_date;
        }

        const response = await axiosClient.post(URL,{
            base_price,
            days_old,
            demand_level,
            input_date
        })

        return NextResponse.json(response.data)
        
    } catch (error: any) {
        return NextResponse.json({
            error: error.message
        }, {
            status: 500
        })
    }
}