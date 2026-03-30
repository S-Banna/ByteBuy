import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a filter extraction engine for an online computer hardware store. Your only task is to extract structured filters from a user's message
Rules:
- Only extract filters that are explicitly or clearly implied by the message.
- Do NOT assume or hallucinate values that aren't mentioned.
- For budget, parse natural language like "under $800", "around 1k", or "between 500 and 900".
- For brands, recognize common aliases: "Apple" → "Apple", "nVidia" → "NVIDIA".
- If a user says "for gaming",  add "gaming" to use_cases and consider min_vram_gb if a GPU is implied.
- Return an empty object {} if no filters can be confidently extracted.
- You may extrapolate values for the specs from the message if they are clearly implied, for example "a gaming laptop" may imply a min_vram_gb of at least 4GB, but "a laptop for programming" does not imply any specific vram requirement.`

export async function POST(request: Request) {
    try {

        const { message } = await request.json();

        const response = await openai.responses.parse({
            model: "gpt-5-mini",
            input: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "hardware_filters",
                    schema: hardwareFilterSchema,
                    strict: true
                }
            }
        })
        
        return NextResponse.json(response)
    
    } catch (err: any) {
        console.error("API /api/extract error:", err);

        return NextResponse.json(
            { error: err?.message ?? "internal server error ts pmo " },
            { status: 500 },
        );
    }
}

export const hardwareFilterSchema = {
    type: "object",
    properties: {
        category:{
            type: "string",
            enum: ["laptop", "desktop", "gpu", "monitor", "cpu", "ram", "storage"],
            description: "The category of computer hardware the user is interested in."
        },
        budget: {
            type: "object",
            properties: {
                min: {type: "number", description: "Minimum budget in USD"},
                max: {type: "number", description: "Maximum budget in USD"}
            },
            required: ["min", "max"],
            description: "The user's budget range for the product.",
            additionalProperties: false
        },
        brands: {
            type: "array",
            items: {type: "string"},
            description: "Preferred brands mentioned by the user, for example: ['AMD', 'Intel', 'NVIDIA']"
        },
        use_cases: {
            type: "array",
            items: {type: "string"},
            description: "Specific use cases mentioned by the user, such as 'gaming', 'video editing', 'office work', 'engineering', 'design', 'programming', or 'coursework'."
        },
        specs: {
            type: "object",
            properties: {
                min_vram_gb: {type: "number", description: "Minimum VRAM in GB, relevant for GPUs and laptops or desktops that have GPUs."},
                min_ram_gb: {type: "number", description: "Minimum RAM in GB, relevant for laptops and desktops."},
                min_storage_gb: {type: "number", description: "Minimum storage in GB, relevant for laptops ,desktops, and storage devices."},
                storage_type: {type: "string", enum: ["HDD", "SSD"], description: "Preferred storage type, relevant for laptops, desktops, and storage devices."},
                min_cpu_cores: {type: "number", description: "Minimum number of CPU cores, relevant for desktops ,laptops, and CPUs."},
                display_size_inch: {type: "number", description: "Preferred display size in inches, relevant for laptops and monitors."}
            },
            required: ["min_vram_gb", "min_ram_gb", "min_storage_gb", "storage_type", "min_cpu_cores", "display_size_inch"],
            description: "Specific technical specifications mentioned or implied by the user.",
            additionalProperties: false
        },
    },
    additionalProperties: false,
    required: ["category", "budget", "brands", "use_cases", "specs"]
}