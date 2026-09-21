import { trpc } from "~/trpc/client";

export const useCreateSubmission = () => {
    const {
        mutateAsync: createSubmissionAsync,
        mutate: createSubmission,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    } = trpc.formSubmission.createSubmission.useMutation({});

    return {
        createSubmissionAsync,
        createSubmission,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status,
    };
};

export const useDeleteSubmission = (formId : string)=>{
    const utils= trpc.useUtils()

    const {
        mutateAsync: deleteSubmissionAsync,
        mutate: deleteSubmission,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
      } = trpc.formSubmission.deleteSubmission.useMutation({
        onSuccess: async () => {
          await utils.formSubmission.getSubmission.invalidate({formId});
        },
      });
    
      return {
        deleteSubmissionAsync,
        deleteSubmission,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status,
      };
}

export const useGetSubmissionsByFormId = (formId: string) => {
    const {
        data: submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.formSubmission.getSubmission.useQuery({formId});

    return {
        submissions,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    };
};
