import { useState } from "react";

const AddRewardCollaborator = () => {
  const [condition, setCondition] = useState([
    {
      type_condition: "and",
      condition_level: [
        {
          type_condition: "and",
          condition: [{ kind: "", operator: "", value: "" }],
        },
      ],
    },
  ]);
  return (
    <div>
      <a>jjj</a>
    </div>
  );
};

export default AddRewardCollaborator;
