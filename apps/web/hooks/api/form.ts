import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync: createFormAsync,
        mutate: createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.form.createForm.useMutation({
        onSuccess: async () => {
            await utils.form.invalidate();
        },
    });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
};


export const useListForms = ()=>{
    

    const{
        data : forms,
        isFetched,
        isFetching,
        isLoading,
        status,
        error,

    } =trpc.form.listForms.useQuery()
return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };



 

    
}

export const useGetFormWithFields = (formId: string) => {
    const {
        data: form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.getFormWithFields.useQuery({id: formId });

    return {
        form,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};

export const useUpdateForm = (formId: string) => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormAsync,
    mutate: updateForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.updateForms.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.form.listForms.invalidate(),
        utils.form.getFormWithFields.invalidate({
          id: formId,
        }),
      ]);
    },
  });

  return {
    updateFormAsync,
    updateForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};


export const useDeleteForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.deleteForms.useMutation({
    onSuccess: async () => {
      await utils.form.listForms.invalidate();
    },
  });

  return {
    deleteFormAsync,
    deleteForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useUpdateFormStatus = (formId: string ) => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormStatusAsync,
    mutate: updateFormStatus,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.updateFormStatus.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.form.listForms.invalidate(),
        utils.form.getFormWithFields.invalidate({
          id: formId,
        }),
      ]);
    },
  });

  return {
    updateFormStatusAsync,
    updateFormStatus,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};
