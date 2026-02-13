import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Droplets, 
  ThermometerSun, 
  CircleOff, 
  Wind,
  Shirt,
  Sparkles,
  Sun,
  CircleDot
} from "lucide-react";

export interface WashingInstruction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const WASHING_INSTRUCTIONS: WashingInstruction[] = [
  { id: "machine_wash_40", label: "Larje në lavatriçe 40°C", icon: <Droplets className="h-5 w-5" /> },
  { id: "machine_wash_60", label: "Larje në lavatriçe 60°C", icon: <Droplets className="h-5 w-5" /> },
  { id: "machine_wash_90", label: "Larje në lavatriçe 90°C", icon: <Droplets className="h-5 w-5" /> },
  { id: "iron_low", label: "Hekurosje në temperaturë të ulët", icon: <ThermometerSun className="h-5 w-5" /> },
  { id: "iron_medium", label: "Hekurosje në temperaturë mesatare", icon: <ThermometerSun className="h-5 w-5" /> },
  { id: "iron_high", label: "Hekurosje në temperaturë të lartë", icon: <ThermometerSun className="h-5 w-5" /> },
  { id: "no_bleach", label: "Mos përdor zbardhues", icon: <CircleOff className="h-5 w-5" /> },
  { id: "bleach_allowed", label: "Lejohet zbardhues", icon: <Sparkles className="h-5 w-5" /> },
  { id: "tumble_dry_low", label: "Tharje në tharëse (temperaturë e ulët)", icon: <Wind className="h-5 w-5" /> },
  { id: "tumble_dry_normal", label: "Tharje në tharëse (normale)", icon: <Wind className="h-5 w-5" /> },
  { id: "no_tumble_dry", label: "Mos e thaj në tharëse", icon: <CircleOff className="h-5 w-5" /> },
  { id: "dry_clean", label: "Pastrim kimik", icon: <CircleDot className="h-5 w-5" /> },
  { id: "no_dry_clean", label: "Mos e pastroni kimikisht", icon: <CircleOff className="h-5 w-5" /> },
  { id: "hang_dry", label: "Thaje të varur", icon: <Shirt className="h-5 w-5" /> },
  { id: "dry_in_shade", label: "Thaje në hije", icon: <Sun className="h-5 w-5" /> },
];

interface WashingInstructionsEditorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function WashingInstructionsEditor({ value, onChange }: WashingInstructionsEditorProps) {
  const toggleInstruction = (instructionId: string) => {
    if (value.includes(instructionId)) {
      onChange(value.filter((id) => id !== instructionId));
    } else {
      onChange([...value, instructionId]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WASHING_INSTRUCTIONS.map((instruction) => (
          <div
            key={instruction.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              value.includes(instruction.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50"
            }`}
            onClick={() => toggleInstruction(instruction.id)}
          >
            <Checkbox
              id={instruction.id}
              checked={value.includes(instruction.id)}
              onCheckedChange={() => toggleInstruction(instruction.id)}
            />
            <div className="flex items-center gap-2 flex-1">
              <span className="text-muted-foreground">{instruction.icon}</span>
              <Label htmlFor={instruction.id} className="cursor-pointer text-sm font-normal">
                {instruction.label}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Frontend display component
interface WashingInstructionsDisplayProps {
  instructions: string[];
}

export function WashingInstructionsDisplay({ instructions }: WashingInstructionsDisplayProps) {
  if (!instructions || instructions.length === 0) return null;

  const activeInstructions = WASHING_INSTRUCTIONS.filter((i) => 
    instructions.includes(i.id)
  );

  if (activeInstructions.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {activeInstructions.map((instruction) => (
        <div
          key={instruction.id}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="text-primary">{instruction.icon}</span>
          <span>{instruction.label}</span>
        </div>
      ))}
    </div>
  );
}
