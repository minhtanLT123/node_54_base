import { prisma } from "../common/prisma/connect.prisma.js";
export const authService = {
   async register(req) {
    // nhan du lieu tu FE gui len
    const {email, password, fullname} = req.body;

    // kiem tra email co ton tai trong db hay khong
    const userExits = await  prisma.users.findUnique({
        where:{
            email: email,
        },
    })
    if(userExits){
        throw new BadrequestException ("nguo dung da ton tai")
    }
    // tao moi nguoi dung vao db
    const newUser = await prisma.users.create({
        data:{
            email: email,
            password: password,
            fullName: fullname,
        }
    })
    console.log( {email, password, fullname, userExits, newUser});
      return true;
   },

   async login(req) {
      return `login`;
   },
};