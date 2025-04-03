import { useState } from "react";
import { FormComponent } from "./FormComponent";
import { FormType, FormValues } from "./form";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FormResponse = FormValues<typeof taskForm>;

export const FormPage = () => {
  const [open, setOpen] = useState(false);

  const [display, setDisplay] = useState<"column" | "row">("column");

  const handleClick = () =>
    setDisplay((prev) => (prev === "column" ? "row" : "column"));

  const handleSubmit = async (answer: FormResponse) => {
    console.log(answer);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOpen(false);
  };

  return (
    <div>
      <div>
        cahneg form display
        <Checkbox onClick={handleClick} />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button>Test</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            <CardContent>
              <FormComponent
                onSubmit={handleSubmit}
                display={display}
                form={taskForm}
              />
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const taskForm: FormType = {
  questions: [
    {
      type: "string",
      name: "name",
      label: "Nom",
      placeholder: "Nom",
      required: true,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Age",
      required: true,
    },
    {
      type: "boolean",
      name: "isCool",
      label: "Est cool",
      placeholder: "Est cool",
      required: true,
    },
    {
      type: "string",
      name: "oulalala",
      label: "oulalala",
      placeholder: "oulalala",
      required: false,
    },
    {
      type: "select",
      name: "fjkdfok",
      label: "select",
      placeholder: "seelct",
      options: [
        { name: "test", value: "test" },
        { name: "aaaa", value: "aaa" },
        { name: "bbb", value: "bbbb" },
        { name: "cxcc", value: "cccc" },
      ],
      required: false,
    },
    {
      type: "boolean",
      name: "aaaaa",
      label: "Est aaaaa",
      placeholder: "Est cool",
      required: false,
    },
    {
      type: "user",
      name: "topUser",
      label: "Attribué à:",
      placeholder: "Est cool",
      required: false,
    },
  ],
};
