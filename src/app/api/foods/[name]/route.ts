import { foods } from "@/data";


export async function GET(req: Request, { params }: { params: { name: string } }) { 
    const { name } = await params;
    if (name) {
        const food = foods.find((food) => food.name.toLowerCase().replace(" ", "-") === name.toLowerCase());
        return new Response(JSON.stringify(food), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200
        });
        
    }else{
        return new Response("Food not found", {
            headers: {
                "Content-Type": "application/json",
            },
            status: 404
        });
    }
}
