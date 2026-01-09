import { ModelStatic } from "sequelize";
const validateFields = (data: Record<any, any>, model: ModelStatic<any>): boolean => {
    let attributes = model.getAttributes();
    for(let key in data){
        if(!attributes[key]){
            return false;
        }
    }
    return true;
}

export default validateFields;