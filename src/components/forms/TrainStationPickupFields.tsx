import { Label } from "@/components/ui/label";
import { Input } from "@/lib/compat";
import { Checkbox } from "@/components/ui/checkbox";

interface TrainStationPickupFieldsProps {
  formData: {
    train_number: string;
    arrival_time: string;
    wait_time: string;
    meet_and_greet: boolean;
    name_sign: string;
  };
  onChange: (formData: any) => void;
}

export function TrainStationPickupFields({ formData, onChange }: TrainStationPickupFieldsProps) {
  const handleFieldChange = (field: string, value: string | boolean) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 border-l-2 border-primary/30">
      <div className="space-y-2">
        <Label htmlFor="train_number">Zugnummer</Label>
        <Input
          id="train_number"
          value={formData.train_number}
          onChange={(e) => handleFieldChange("train_number", e.target.value)}
          placeholder="z.B. ICE 123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train_arrival_time">Ankunftszeit</Label>
        <Input
          id="train_arrival_time"
          type="time"
          value={formData.arrival_time}
          onChange={(e) => handleFieldChange("arrival_time", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="train_wait_time">Wartezeit (Minuten)</Label>
        <Input
          id="train_wait_time"
          type="number"
          min="0"
          value={formData.wait_time}
          onChange={(e) => handleFieldChange("wait_time", e.target.value)}
        />
      </div>

      <div className="sm:col-span-2 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="train_meet_and_greet"
            checked={formData.meet_and_greet}
            onCheckedChange={(checked) => handleFieldChange("meet_and_greet", !!checked)}
          />
          <Label htmlFor="train_meet_and_greet" className="cursor-pointer">
            Meet & Greet Service
          </Label>
        </div>

        {formData.meet_and_greet && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="train_name_sign">Namensschild</Label>
            <Input
              id="train_name_sign"
              value={formData.name_sign}
              onChange={(e) => handleFieldChange("name_sign", e.target.value)}
              placeholder="Name für Abholschild"
            />
          </div>
        )}
      </div>
    </div>
  );
}
