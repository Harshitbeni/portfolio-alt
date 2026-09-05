import { ObjectRow } from "@/components/object-row";
import { OBJECT_ITEMS } from "@/lib/objects";

export function ObjectsPanel() {
  return (
    <div className="flex w-full flex-col gap-6">
      {OBJECT_ITEMS.map((item) => (
        <ObjectRow key={item.id} item={item} />
      ))}
    </div>
  );
}
