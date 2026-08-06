// apps/web/app/dashboard/forms/[id]/page.tsx

"use client";

import { useEffect,useState, type FormEvent } from "react";
import { useParams } from "next/navigation";

import { useCreateField, useGetFields ,useUpdateField, useDeleteField } from "~/hooks/api/form-field";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";

export default function FormBuilder() {
    const params = useParams();
    const formId = params?.id as string | undefined;

    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [type, setType] = useState<"TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD">("TEXT");
    const [description, setDescription] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [isRequired, setIsRequired] = useState(false);

   

    //edit states
    const [editFieldId, setEditFieldId] = useState<string | null>(null);
    //dlt
    const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null);

const [editLabel, setEditLabel] = useState("");
const [editType, setEditType] = useState<
    "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD"
>("TEXT");
const [editDescription, setEditDescription] = useState("");
const [editPlaceholder, setEditPlaceholder] = useState("");
const [editIsRequired, setEditIsRequired] = useState(false);
//

 const { createFieldAsync, status, error } = useCreateField(formId ?? "");
    const { fields, isLoading: fieldsLoading } = useGetFields(formId ?? "");
//dlt hook call


const {
  deleteFieldAsync,
  status: deleteStatus,
  error: deleteError,
} = useDeleteField(formId ?? "");

//update hook call area

const {
    updateFieldAsync,
    status: updateStatus,
    error: updateError,
} = useUpdateField(formId ?? "");

//edit
const editingField = fields?.find((field) => field.id === editFieldId);

//dlt
const deletingField = fields?.find(
  (field) => field.id === deleteFieldId
);

//
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formId) return;

        await createFieldAsync({
            label: label.trim(),
            type,
            formId,
            description: description.trim() ? description.trim() : undefined,
            placeholder: placeholder.trim() ? placeholder.trim() : undefined,
            isRequired,
        });

        setOpen(false);
        setLabel("");
        setType("TEXT");
        setDescription("");
        setPlaceholder("");
        setIsRequired(false);
    };

    //useeffect for updation

    useEffect(() => {
    if (!editingField) return;

    setEditLabel(editingField.label);
    setEditType(editingField.type);
    setEditDescription(editingField.description ?? "");
    setEditPlaceholder(editingField.placeholder ?? "");
    setEditIsRequired(editingField.isRequired);
}, [editingField]);

//updatehandler

const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editFieldId) return;

    await updateFieldAsync({
        fieldId: editFieldId,
        label: editLabel.trim(),
        type: editType,
        description: editDescription.trim()
            ? editDescription.trim()
            : undefined,
        placeholder: editPlaceholder.trim()
            ? editPlaceholder.trim()
            : undefined,
        isRequired: editIsRequired,
    });

    setEditFieldId(null);
};

//dlthandler
const handleDelete = async () => {
  if (!deleteFieldId) return;

  await deleteFieldAsync({
    fieldId: deleteFieldId,
  });

  setDeleteFieldId(null);
};
    
     return(<main className="min-h-screen bg-black px-6 py-6 text-white">
        
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Form Builder</h1>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-black">Create Field</Button>
                        </DialogTrigger>

                        <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Field</DialogTitle>
                                <DialogDescription className="text-white/60">
                                    Add a field to this form.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="text-sm text-white/70 block mb-1">
                                        Label
                                    </label>
                                    <Input
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value)}
                                        placeholder="Field label"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/70 block mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) =>
                                            setType(
                                                e.target.value as
                                                    | "TEXT"
                                                    | "NUMBER"
                                                    | "EMAIL"
                                                    | "YES_NO"
                                                    | "PASSWORD",
                                            )
                                        }
                                        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm text-white"
                                    >
                                        <option value="TEXT">Text</option>
                                        <option value="NUMBER">Number</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="YES_NO">Yes / No</option>
                                        <option value="PASSWORD">Password</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm text-white/70 block mb-1">
                                        Description
                                    </label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Optional helper text"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/70 block mb-1">
                                        Placeholder
                                    </label>
                                    <Input
                                        value={placeholder}
                                        onChange={(e) => setPlaceholder(e.target.value)}
                                        placeholder="Optional placeholder"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={isRequired}
                                        onCheckedChange={(v) => setIsRequired(Boolean(v))}
                                    />
                                    <span className="text-sm text-white/70">Required</span>
                                </div>

                                {error ? (
                                    <p className="text-sm text-red-400">{error.message}</p>
                                ) : null}

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || !label.trim()}
                                        className="bg-white text-black"
                                    >
                                        {status === "pending" ? "Creating..." : "Create Field"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-3">
                    <div className="border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                        Form canvas
                    </div>

                    {fieldsLoading ? (
                        <div className="border border-white/10 bg-white/5 p-4 text-sm text-white/50">
                            Loading fields...
                        </div>
                    ) : fields && fields.length > 0 ? (
                        fields.map((f) => (
                            <div
                                key={f.id}
                                className="border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-white font-medium">{f.label}</div>
                                    <div className="text-white/60 text-sm">
                                        {f.description || f.placeholder || ""}
                                    </div>
                                </div>

    <div className="flex items-center gap-3">
  <div className="text-sm text-white/60">
    {f.type}
  </div>

  <Button
    type="button"
    variant="outline"
    onClick={() => setEditFieldId(f.id)}
  >
    Edit
  </Button>

  <Button
    type="button"
    variant="destructive"
    onClick={() => setDeleteFieldId(f.id)}
  >
    Delete
  </Button>
</div>
                            </div>
                        ))
                    ) : (
                        <div className="border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                            No fields yet.
                        </div>
                    )}
                </section>
            </div>



            <Dialog
    open={editFieldId !== null}
    onOpenChange={(isOpen) => {
        if (!isOpen) {
            setEditFieldId(null);
        }
    }}
>
    <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
        <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>

            <DialogDescription className="text-white/60">
                Update this field's settings.
            </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
                <label className="mb-1 block text-sm text-white/70">
                    Label
                </label>

                <Input
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    placeholder="Field label"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm text-white/70">
                    Type
                </label>

                <select
                    value={editType}
                    onChange={(e) =>
                        setEditType(
                            e.target.value as
                                | "TEXT"
                                | "NUMBER"
                                | "EMAIL"
                                | "YES_NO"
                                | "PASSWORD",
                        )
                    }
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm text-white"
                >
                    <option value="TEXT">Text</option>
                    <option value="NUMBER">Number</option>
                    <option value="EMAIL">Email</option>
                    <option value="YES_NO">Yes / No</option>
                    <option value="PASSWORD">Password</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block text-sm text-white/70">
                    Description
                </label>

                <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Optional helper text"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm text-white/70">
                    Placeholder
                </label>

                <Input
                    value={editPlaceholder}
                    onChange={(e) => setEditPlaceholder(e.target.value)}
                    placeholder="Optional placeholder"
                />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    checked={editIsRequired}
                    onCheckedChange={(value) =>
                        setEditIsRequired(Boolean(value))
                    }
                />

                <span className="text-sm text-white/70">Required</span>
            </div>

            {updateError ? (
                <p className="text-sm text-red-400">
                    {updateError.message}
                </p>
            ) : null}

            <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditFieldId(null)}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        updateStatus === "pending" ||
                        !editLabel.trim()
                    }
                    className="bg-white text-black"
                >
                    {updateStatus === "pending"
                        ? "Updating..."
                        : "Update Field"}
                </Button>
            </DialogFooter>
        </form>
    </DialogContent>
</Dialog>




<Dialog
  open={deleteFieldId !== null}
  onOpenChange={(isOpen) => {
    if (!isOpen && deleteStatus !== "pending") {
      setDeleteFieldId(null);
    }
  }}
>
  <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Delete field?</DialogTitle>

      <DialogDescription className="text-white/60">
        Are you sure you want to delete
        {deletingField ? ` "${deletingField.label}"` : " this field"}?
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    {deleteError ? (
      <p className="text-sm text-red-400">
        {deleteError.message}
      </p>
    ) : null}

    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        disabled={deleteStatus === "pending"}
        onClick={() => setDeleteFieldId(null)}
      >
        Cancel
      </Button>

      <Button
        type="button"
        variant="destructive"
        disabled={deleteStatus === "pending"}
        onClick={handleDelete}
      >
        {deleteStatus === "pending"
          ? "Deleting..."
          : "Delete Field"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        </main>
    
)}
