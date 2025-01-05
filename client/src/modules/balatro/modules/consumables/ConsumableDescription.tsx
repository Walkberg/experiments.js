import { Consumable, ConsumableType } from "../../plugins";

interface ConsumableDescriptionProps {
  consumable: Consumable;
}

export const ConsumableDescription = ({
  consumable,
}: ConsumableDescriptionProps) => {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="text-white">{consumable.name}</div>
      <div className="min-w-fit bg-white rounded-2xl p-2">
        {consumable.description}
      </div>
      <ConsumableTypeTag type={consumable.type} />
    </div>
  );
};

export const ConsumableTypeTag = ({ type }: { type: ConsumableType }) => {
  const color = getConsumableTypeToColor(type);
  return (
    <div
      className="text-white px-8 py-2 rounded-2xl"
      style={{ backgroundColor: color }}
    >
      {getConsumableTypeToText(type)}
    </div>
  );
};

export function getConsumableTypeToText(type: ConsumableType) {
  switch (type) {
    case "tarot":
      return "Tarot";
    case "planet":
      return "Planet";
  }
}

export function getConsumableTypeToColor(type: ConsumableType) {
  switch (type) {
    case "tarot":
      return "#448811";
    case "planet":
      return "#148811";
  }
}
