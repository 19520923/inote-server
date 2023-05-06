import { Server } from "socket.io";
import passport from "passport";
import { Project } from "../../api/project";
class socket extends Function {
  constructor() {
    super();
    return this.bind(this);
  }

  connect(server) {
    this.io = new Server(server, { cors: { origin: "*" } });
    this.io.use(this.wrapMiddlewareForSocketIo(passport.initialize()));
    this.io.use(this.wrapMiddlewareForSocketIo(passport.session()));
    this.io.use(this.wrapMiddlewareForSocketIo(passport.authenticate(["jwt"])));

    this.io.on("connection", async (socket) => {
      const user = socket.request.user;
      socket.join(user.id);

      const projects = await Project.find({
        $or: [{ author: user.id }, { hosts: user.id }, { members: user.id }],
        deleted_flag: false,
      });

      projects.forEach((project) => {
        socket.join(project.id);
      });

      socket.emit("user:connect", { user_id: user.id });

      socket.on("disconnect", async () => {
        socket.emit("user:disconnect", {
          user_id: user.id,
        });
        socket.leave(user.id);
        projects.forEach((project) => {
          socket.leave(project.id);
        });
      });

      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
    });
  }

  wrapMiddlewareForSocketIo(middleware) {
    return (socket, next) => middleware(socket.request, {}, next);
  }

  toAll(message) {
    return (data) => {
      this.io.emit(message, data);
      return data;
    };
  }

  async to(message, socket_id, data) {
    if (socket_id && data) {
      this.io.to(socket_id).emit(message, data);
    }
    return data;
  }
}

export default new socket();
