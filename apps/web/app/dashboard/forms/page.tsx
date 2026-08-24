// apps/web/app/dashboard/forms/page.tsx

"use client";

import { useEffect , useState, type FormEvent } from "react";
import Link from "next/link";
import {Check,
  Copy,
  ExternalLink, Eye, PencilLine, Share2 } from "lucide-react";

import { useCreateForm, useListForms ,useUpdateForm , useDeleteForm , useUpdateFormStatus } from "~/hooks/api/form";

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

export default function DashboardForms() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { createFormAsync, error, status } = useCreateForm();
    const { forms, isLoading } = useListForms();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createFormAsync({
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
        });

        setOpen(false);
        setTitle("");
        setDescription("");
    };

    //updateform
    const [editFormId, setEditFormId] = useState<string | null>(null);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");


const editingForm = forms?.find(
  (form) => form.id === editFormId
);

useEffect(() => {
  if (!editingForm) return;

  setEditTitle(editingForm.title);
  setEditDescription(editingForm.description ?? "");
}, [editingForm]);


const {
  updateFormAsync,
  isPending: isUpdatingForm,
  error: updateFormError,
} = useUpdateForm(editFormId ?? "");

const handleUpdateForm = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!editFormId) return;

  try {
    await updateFormAsync({
      formId: editFormId,
      title: editTitle.trim(),
      description: editDescription.trim(),
    });

    setEditFormId(null);
  } catch {
    // The mutation error is available through updateFormError
  }
};

//dlltform
const [deleteFormId, setDeleteFormId] =
  useState<string | null>(null);

  const {
  deleteFormAsync,
  isPending: isDeletingForm,
  error: deleteFormError,
} = useDeleteForm();

const deletingForm = forms?.find(
  (form) => form.id === deleteFormId
);

const handleDeleteForm = async () => {
  if (!deleteFormId) return;

  try {
    await deleteFormAsync({
      formId: deleteFormId,
    });

    setDeleteFormId(null);
  } catch {
    // Mutation error is available through deleteFormError.
    // Keep the dialog open so the user can see it.
  }
};

//shareform
// Share form
const [shareFormId, setShareFormId] =
  useState<string | null>(null);

const [origin, setOrigin] = useState("");
const [copied, setCopied] = useState(false);

useEffect(() => {
  setOrigin(window.location.origin);
}, []);

const sharingForm = forms?.find(
  (form) => form.id === shareFormId
  
);

const publicFormUrl =
  shareFormId && origin
    ? `${origin}/form/${shareFormId}`
    : "";


const handleCopyFormLink = async () => {
  if (!publicFormUrl) return;

  try {
    await navigator.clipboard.writeText(publicFormUrl);
    setCopied(true);
  } catch (error) {
    console.error("Unable to copy form link:", error);
  }
};

const handleOpenPublicForm = () => {
  if (!publicFormUrl) return;

  window.open(
    publicFormUrl,
    "_blank",
    "noopener,noreferrer"
  );
};


//here status code
const {
  updateFormStatusAsync,
  isPending: isUpdatingFormStatus,
  error: updateFormStatusError,
} = useUpdateFormStatus(shareFormId ?? "");

const handlePublishForm = async () => {
  if (!shareFormId) return;

  try {
    await updateFormStatusAsync({
      formId: shareFormId,
      status: "PUBLISHED",
    });
  } catch {
    // The mutation error is available in updateFormStatusError.
  }
};

const handleDraftForm = async () => {
  if (!shareFormId) return;

  try {
    await updateFormStatusAsync({
      formId: shareFormId,
      status: "DRAFT",
    });
  } catch {
    // The mutation error is available in updateFormStatusError.
  }
};

    return (
        <main className="min-h-screen bg-black px-6 py-6 text-white">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-white/60">Forms</p>
                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-black hover:bg-white/90">
                                Create Form
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Form</DialogTitle>
                                <DialogDescription className="text-white/60">
                                    Add a title and optional description.
                                </DialogDescription>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm text-white/70">
                                        Title
                                    </label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(event) => setTitle(event.target.value)}
                                        placeholder="Form title"
                                        className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm text-white/70">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                        placeholder="Optional description"
                                        className="min-h-24 border-white/10 bg-white/5 text-white placeholder:text-white/30"
                                    />
                                </div>

                                {error ? (
                                    <p className="text-sm text-red-400">{error.message}</p>
                                ) : null}

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={status === "pending" || title.trim().length === 0}
                                        className="bg-white text-black hover:bg-white/90"
                                    >
                                        {status === "pending" ? "Creating..." : "Create"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="grid gap-3">
                    {isLoading ? (
                        <div className="border border-white/10 bg-white/5 p-6 text-sm text-white/50">
                            Loading forms...
                        </div>
                    ) : forms && forms.length > 0 ? (
                        forms.map((form) => (
                            <article
                                key={form.id}
                                className="border border-white/10 bg-white/5 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <h2 className="text-base font-medium text-white">
                                            {form.title}
                                        </h2>
                                        <p className="text-sm text-white/60">
                                            {form.description || "No description"}
                                        </p>
                                        <span className="block text-xs text-white/35">
                                            {form.createdAt
                                                ? new Date(form.createdAt).toLocaleDateString()
                                                : ""}
                                        </span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        >
                                            <Link
                                                href={`/dashboard/forms/${form.id}/submissions`}
                                                aria-label="View submissions"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </Button>

                                        <Button
                                            asChild
                                            variant="outline"
                                            size="icon"
                                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        >
                                            <Link
                                                href={`/dashboard/forms/${form.id}`}
                                               aria-label="Manage form fields"
                                            >
                                                <PencilLine className="size-4" />
                                            </Link>
                                        </Button>

 <Button
  type="button"
  variant="outline"
  size="icon"
  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
  onClick={() => {
    setShareFormId(form.id);
    setCopied(false);
  }}
  aria-label={`Share ${form.title}`}
>
  <Share2 className="size-4" />
</Button>


<Button
  type="button"
  variant="outline"
  onClick={() => setEditFormId(form.id)}
>
  Edit
</Button>

<Button
  type="button"
  variant="destructive"
  onClick={() => setDeleteFormId(form.id)}
>
  Delete
</Button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                            No forms yet.
                        </div>
                    )}
                </section>
            </div>





            <Dialog
  open={editFormId !== null}
  onOpenChange={(isOpen) => {
    if (!isOpen && !isUpdatingForm) {
      setEditFormId(null);
    }
  }}
>
  <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Edit Form</DialogTitle>

      <DialogDescription className="text-white/60">
        Update the title and description of your form.
      </DialogDescription>
    </DialogHeader>

    <form
      className="space-y-4"
      onSubmit={handleUpdateForm}
    >
      <div>
        <label className="mb-1 block text-sm text-white/70">
          Title
        </label>

        <Input
          value={editTitle}
          onChange={(event) =>
            setEditTitle(event.target.value)
          }
          placeholder="Form title"
          maxLength={30}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-white/70">
          Description
        </label>

        <Textarea
          value={editDescription}
          onChange={(event) =>
            setEditDescription(event.target.value)
          }
          placeholder="Optional form description"
          maxLength={300}
        />
      </div>

      {updateFormError ? (
        <p className="text-sm text-red-400">
          {updateFormError.message}
        </p>
      ) : null}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isUpdatingForm}
          onClick={() => setEditFormId(null)}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isUpdatingForm ||
            !editTitle.trim()
          }
          className="bg-white text-black"
        >
          {isUpdatingForm
            ? "Updating..."
            : "Update Form"}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>



<Dialog
  open={deleteFormId !== null}
  onOpenChange={(isOpen) => {
    if (!isOpen && !isDeletingForm) {
      setDeleteFormId(null);
    }
  }}
>
  <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Delete form?</DialogTitle>

      <DialogDescription className="text-white/60">
        Are you sure you want to delete
        {deletingForm
          ? ` "${deletingForm.title}"`
          : " this form"}
        ? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    {deleteFormError ? (
      <p className="text-sm text-red-400">
        {deleteFormError.message}
      </p>
    ) : null}

    <DialogFooter>
      <Button
        type="button"
        variant="outline"
        disabled={isDeletingForm}
        onClick={() => setDeleteFormId(null)}
      >
        Cancel
      </Button>

      <Button
        type="button"
        variant="destructive"
        disabled={isDeletingForm}
        onClick={handleDeleteForm}
      >
        {isDeletingForm
          ? "Deleting..."
          : "Delete Form"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


<Dialog
  open={shareFormId !== null}
  onOpenChange={(isOpen) => {
    if (!isOpen && !isUpdatingFormStatus) {
      setShareFormId(null);
      setCopied(false);
    }
  }}
>
  <DialogContent className="border-white/10 bg-zinc-950 text-white sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Share Form</DialogTitle>

      <DialogDescription className="text-white/60">
        {sharingForm?.status === "PUBLISHED"
          ? `Anyone with this link can open and submit "${
              sharingForm.title
            }".`
          : `"${sharingForm?.title ?? "This form"}" is currently a draft.`}
      </DialogDescription>
    </DialogHeader>

    <p className="text-sm text-white/60">
      Status: {sharingForm?.status ?? "Loading..."}
    </p>

    {sharingForm?.status === "PUBLISHED" ? (
      <>
        {/* Sharing link section */}
        <div className="space-y-2">
          <label
            htmlFor="public-form-url"
            className="text-sm text-white/70"
          >
            Public form link
          </label>

          <div className="flex gap-2">
            <Input
              id="public-form-url"
              value={publicFormUrl}
              readOnly
              className="border-white/10 bg-white/5 text-white"
            />

            <Button
              type="button"
              variant="outline"
              disabled={!publicFormUrl}
              onClick={handleCopyFormLink}
              className="shrink-0 border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              {copied ? (
                <Check className="mr-2 size-4" />
              ) : (
                <Copy className="mr-2 size-4" />
              )}

              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShareFormId(null);
              setCopied(false);
            }}
          >
            Close
          </Button>

          <Button
            type="button"
            disabled={!publicFormUrl}
            onClick={handleOpenPublicForm}
            className="bg-white text-black hover:bg-white/90"
          >
            <ExternalLink className="mr-2 size-4" />
            Open Form
          </Button>


   <Button
            type="button"
            disabled={
              isUpdatingFormStatus ||
              !shareFormId
            }
            onClick={handleDraftForm}
            className="bg-white text-black hover:bg-white/90"
          >
            {isUpdatingFormStatus
              ? "UnPublishing..."
              : "Draft Form"}
    </Button>
        </DialogFooter>
      </>
    ) : (
      <>
        {/* Draft form section */}
        <div className="rounded-md border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/70">
            Publish this form before sharing it and accepting responses.
          </p>
        </div>

        {updateFormStatusError ? (
          <p className="text-sm text-red-400">
            {updateFormStatusError.message}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isUpdatingFormStatus}
            onClick={() => {
              setShareFormId(null);
              setCopied(false);
            }}
          >
            Close
          </Button>

          <Button
            type="button"
            disabled={
              isUpdatingFormStatus ||
              !shareFormId
            }
            onClick={handlePublishForm}
            className="bg-white text-black hover:bg-white/90"
          >
            {isUpdatingFormStatus
              ? "Publishing..."
              : "Publish Form"}
          </Button>
        </DialogFooter>
      </>
    )}
  </DialogContent>
</Dialog>
        </main>
    );
}







