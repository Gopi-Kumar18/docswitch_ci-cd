
import { cors, helmet, rateLimit, express, session, MongoStore, dotenv } from '../utils/coreModules.js'
import { getClientIpFromReq } from '../utils/ipUtils.js';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const applyMiddlewares = (app) => {

  app.use(helmet());

  app.use(cors({
    // origin: process.env.CLIENT_ORIGIN,
    origin: process.env.SECURE_CLIENT_ORIGIN,
    credentials: true,
  }));

  app.use(express.json());


 if (isProd) {
    app.set('trust proxy', 1);
  }


  const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 50,
    message: "Too many requests, please try again later.",
    keyGenerator: (req) => {
      return getClientIpFromReq(req) || req.ip || req.socket?.remoteAddress || '';
    }
  });
  app.use(limiter);

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    }
  }));

};
