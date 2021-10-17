import * as task_service from "./task.service"
import * as class_transformer from "class-transformer"
import * as user_entity from "../auth/user.entity"
// @ponicode
describe("getTasks", () => {
    let inst: any

    beforeEach(() => {
        inst = new task_service.TaskService()
    })

    test("0", async () => {
        await inst.getTasks(class_transformer.plainToClass(user_entity.User,{ username: "", firstname: "", lastname: "", password: "", salt: "" }), undefined)
    })
})
