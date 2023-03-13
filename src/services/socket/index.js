import { Server } from "socket.io";
import passport from "passport";
import { User } from "../../api/user";
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

    this.io.on("connection", (socket) => {
      const user = socket.request.user;

      socket.emit("user:connect", { user_id: user.id });
      this.storeSocketIdInDB(socket.id, user.id);

      socket.on("disconnect", () => {
        socket.emit("user:disconnect", {
          user_id: user.id,
        });
        this.storeSocketIdInDB("", user.id);
      });
    });
  }

  wrapMiddlewareForSocketIo(middleware) {
    return (socket, next) => middleware(socket.request, {}, next);
  }

  async storeSocketIdInDB(socket_id, user_id) {
    await User.updateOne(
      { _id: user_id },
      { $set: { socket_id: socket_id } },
      function (err) {
        console.log(err);
      }
    );
  }

  toAll(message) {
    return (data) => {
      this.io.emit(message, data);
      return data;
    };
  }

  async to(message, user_id) {
    const user = await User.findById(user_id);
    return (data) => {
      if (user.socket_id) {
        this.io.to(user.socket_id).emit(message, data);
      }
      return data;
    };
  }
}

export default new socket();
