import {db ,eq, max, placeholder , } from "@repo/database"

import {fieldTypeEnum , formFieldsTable} from "@repo/database/models/form-fields"

import { 
    createFieldInput ,
    CreateFieldInputType , 
    getFieldInput ,
    GetFieldInputType } from "./model"

export function toLabelKey(label :string) :string{
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

export default class FormFieldService{

        public async getNextIndex(formId:string):Promise<string>{
            const result = await db
                .select({maxIndex : max(formFieldsTable.index)})
                .from(formFieldsTable)
                .where(eq(formFieldsTable.formId , formId))

            const current = result[0]?.maxIndex
            const next = current? Number(current) +1 :1

            return next.toString()
        }

        public async createFormField(payload : CreateFieldInputType){
            const {label , type , formId ,description ,placeholder ,isRequired} = await createFieldInput.parseAsync(payload)
            

            const labelKey = toLabelKey(label)
            const index = await this.getNextIndex(formId)

            const result = await db
                            .insert(formFieldsTable)
                            .values({
                                label,
                                labelKey,
                                description,
                                type,
                                placeholder,
                                isRequired,
                                index,
                                formId,
                                

                            })
                            .returning({id: formFieldsTable.id})


            if(!result || result.length===0 || !result[0]?.id){
                throw new Error("Something went wronng while creating the fields of form")
            }

            return( {id:result[0].id , labelKey ,index})
            
        }

        public async getFormField(formId:string){

            const result = await db
                    .select()
                    .from(formFieldsTable)
                    .where(eq(formFieldsTable.formId ,formId))
                    .orderBy(formFieldsTable.index)

            return result.map((r)=> ({
                id: r.id,
                formId:r.formId,
                description: r.description,
                label : r.label,
                labelKey : r.labelKey,
                placeholder:r.placeholder,
                type: r.type,
                index:r.index,
                isRequired :r.isRequired,
                createdAt: r.createdAt ? r.createdAt.toISOString() : null,
                updatedAt: r.updatedAt ? r.updatedAt.toISOString() : null,

            }))

            
        }
        
}