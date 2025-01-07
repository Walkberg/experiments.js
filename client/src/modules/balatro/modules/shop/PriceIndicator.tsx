export const PriceIndicator = ({ price }: { price: number }) => {
  return (
    <div className="flex flex-row gap-2 bg-zinc-900 p-1 rounded-2xl pb-8">
      <div className="bg-zinc-700 text-amber-400 rounded-2xl py-2 px-4 text-3xl font-bold">
        ${price}
      </div>
    </div>
  );
};
