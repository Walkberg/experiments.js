import { useEffect, useState } from "react";
import { ContractList } from "../components/ContractList";
import { Contract } from "../contract";

export const ContractPage = () => {
  const [contracts, setContract] = useState<Contract[]>([]);

  useEffect(() => {
    setContract([{ id: "uij" }, { id: "uij" }, { id: "uij" }, { id: "uij" }]);
  }, []);

  return (
    <div className="m-9">
      <ContractList contracts={contracts} />
    </div>
  );
};
