const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const User = require('./User');
const Topic = require('./Topic');
const Post = require('./Post');
const Comment = require('./Comment');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const app = express();
const port = process.env.PORT || 5000;
const backendDomain = "http://localhost:5000";
const frontendDomain = "http://localhost:3000";

//Load the .env variables
dotenv.config();

mongoose.connect(`${process.env.MONGO_START}${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}${process.env.MONGO_END}`,{
  useNewUrlParser: true,
  useUnifiedTopology: true
},() =>{
  console.log(mongoose.connection.readyState);
    console.log("Connected to mongoose successfully");
});
console.log(mongoose.connection.readyState);

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Restrict axios access to the origin, enable HTTP Cookies with credentials:true
app.use(cors({ origin:frontendDomain,credentials: true}))

app.use(
    session({
        //This is the secret used to sign the session ID cookie
        secret: "jlkjlkjfesioijfe",
        //Forces the session to be saved back to the session store, even if the session was never modified during the request
        resave: true,
        //Forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

/* -------------------AUTH------------------------------- */
passport.serializeUser((user,done) =>{
    return done(null,user._id);
});
passport.deserializeUser((id,done) =>{
  User.findById(id, (err, doc) => {
    // Whatever we return goes to the client and binds to the req.user property
    return done(err, doc);
  })
});

passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: "/auth/google/callback"
  },
    function (_, __, profile, cb) {
        console.log(profile);
        User.findOne({ providerID: profile.id,provider: profile.provider, }, async (err, doc) => {

          if (err) {
            return cb(err, null);
          }
    
          if (!doc) {
            const newUser = new User({
              providerID: profile.id,
              provider: profile.provider,
              username: profile.displayName,
              email: profile.emails[0].value,
              role: "user",
            });
    
            await newUser.save();
            cb(null, newUser);
          }
          cb(null, doc);
        })
    })
);

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect(frontendDomain);
  });


  passport.use(new GitHubStrategy({
    clientID: `${process.env.GITHUB_CLIENT_ID}`,
    clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
    callbackURL: "/auth/github/callback"
  },
    function (_, __, profile, cb) {

      User.findOne({ providerID: profile.id,provider: profile.provider, }, async (err, doc) => {

        if (err) {
          return cb(err, null);
        }
  
        if (!doc) {
          const newUser = new User({
            providerID: profile.id,
            provider: profile.provider,
            username: profile.username,
            email: profile.emails[0].value,
            role: "user",
          });
  
          await newUser.save();
          cb(null, newUser);
        }
        cb(null, doc);
      })
    }
  ));


  app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: "/login", session: true }),
  function (req, res) {
    res.redirect("http://localhost:3000");
  });

  app.get("/getuser", (req, res) => {
    res.send(req.user);
  })

  app.get("/auth/logout", (req, res) => {
    if (req.user) {
      req.logout();
      res.send("done");
    }
  })

  /* -------------------Insertion------------------------------- */
  app.post("/inserttopic", async (req,res) => {
    const newTopic = new Topic({
      created_by: req.body.created_by,
      lower_title: req.body.lower_title,
      title: req.body.title,
    });

    if (req.body.description) newTopic.description = req.body.description;
    if (req.body.likes) newTopic.likes = req.body.likes;
    if (req.body.dislikes) newTopic.dislikes = req.body.dislikes;

    await newTopic.save();
    res.send("done");
  })

  app.post("/insertpost", async (req,res) => {
    const newPost = new Post({
      created_by: req.body.created_by,
      topic: req.body.topic,
      title: req.body.title,
      description: req.body.description,
    });

    if (req.body.likes) newPost.likes = req.body.likes;
    if (req.body.dislikes) newPost.dislikes = req.body.dislikes;

    await newPost.save();
    //Add the post to it's topics posts array
    t = await Topic.findOne({_id:req.body.topicid});
    let l = t.posts;
    l.push(newPost._id);
    t.posts = l;
    await t.save();
    res.send(newPost);
  })

  app.post("/insertcomment", async (req,res) => {
    const newComment = new Comment({
      created_by: req.body.created_by,
      created_by_name: req.body.created_by_name,
      postid: req.body.postid,
      comment: req.body.comment,
    })

    if (req.body.parentid) newComment.parent = req.body.parentid;
    if (req.body.likes) newComment.likes = req.body.likes;
    if (req.body.dislikes) newComment.dislikes = req.body.dislikes;
    if (req.body.children) newComment.children = req.body.dislikes;

    await newComment.save();
    //Add the comment to the post's comments array
    p = await Post.findOne({_id:req.body.postid});
    let l = p.comments;
    l.push(newComment._id);
    p.comments = l;
    await p.save();

    //If the comment has a parent
    //Add the comment to the parent's chlidren array
    if (req.body.parentid){
      c = await Comment.findOne({_id:req.body.parentid});
      c.children.push(newComment._id);
      await c.save();
      newComment.parent_name = c.created_by_name;
    }
    await newComment.save();
    res.send(newComment);
  })

  /* -------------------DELETION------------------------------- */
  app.post("/deletetopic", async (req,res) => {
    let t = await Topic.findOne({_id:req.body.topicID});
    await Post.deleteMany({_id:{$in:t.posts}});
    await Topic.deleteOne({_id:t._id});

    res.send("done");
  })

  app.post("/deletepost", async(req,res) =>{
    let p = await Post.findOne({_id:req.body.id});
    console.log(p);
    await Comment.deleteMany({_id:{$in:p.comments}});
    let t = await Topic.findOne({_id:p.topic})
    let change = t.posts.filter(function(e){return e!== p.topic});
    t.posts = change;
    t.save();
    await Post.deleteOne({_id:p._id});
    
    res.send("done");
  })

  app.post("/deletecomment", async(req,res) =>{
    //Find the comment obj that was clicked
    let c = await Comment.findOne({_id:req.body.id});
    //if C obj has a parent remove C obj from it's children list
    if (c.parent !== null){
      let par = await Comment.findOne({_id:c.parent});
      let parChange = par.children.filter(function(e){
        return e === c._id
      });
      par.children = parChange;
      par.save();
    }
    let a = [];
    console.log(c);
    if (c.children.length !== 0){
      let na = await getChildrenComments(c);
      console.log(na);
      a.push(na);
    }
    console.log(a);
    //Delete all the children from the db
    await Comment.deleteMany({_id:{$in:a}});
    //Grab the post and delete all the children that we deleted
    let p = await Post.findOne({_id:c.postid});
    let change = p.comments.filter(function(e){
      for(let i = 0;i<a.length;i++){
        if (e === a[i] || e === req.body.id){
          return true;
        }
      }
      return false;
    });
    p.comments = change;
    p.save();
    //Finally delete the comment we clicked on
    await Comment.deleteOne({_id:req.body.id});
    
    res.send("done");
  })

  //Recursive
  getChildrenComments = async(c) =>{
    let a = [];
    c.children.map(async(newcid)=>{
      //Get the new comment
      let newc = await Comment.findOne({_id:newcid});
      console.log("WAITIT");
      //Add the new comment to the array
      a.push(newc._id);
      //See if new comment has any children
      if (newc.children.length !== 0){
        //If it does call this function again with this new comment
        let ng = getChildrenComments(newc);
        console.log(ng);
        a.push(ng);
      }
    })
    return a;
  }

  /* -------------------List------------------------------- */
  app.post("/listalltopics", async(req,res) => {
    res.send(await Topic.find());
  })

  app.post("/listposts", async(req,res) => {
    var r = await Post.find({topic:mongoose.Types.ObjectId(req.body.topicID)});
    res.send(r);
  })

  /* -------------------Gets------------------------------- */
  //Get all comments from a post using the post ID
  app.post("/getPostComments", async(req,res) => {
    var r = await Comment.find({postid:req.body.postID});
    res.send(r);
  })

  app.post("/gettopic", async(req,res) => {
    var r = await Topic.findOne({_id:req.body.topicID});
    res.send(r);
  })

  app.post("/getpost", async(req,res) => {
    var r = await Post.findOne({_id:req.body.postID});
    res.send(r);
  })
  //Get the topic ID using the topic name
  app.post("/topicNameToID", async(req,res) => {
    var r = await Topic.findOne({lower_title:req.body.topicName});
    res.send(r);
  })

  /* -------------------LikeCounter------------------------------- */
  app.post("/addUserToLikes", async(req,res) => {
    let t;
    let result;
    if (req.body.modal === "post"){
      t = await Post.findOne({_id:req.body.id});
    }else if (req.body.modal === "topic"){
      t = await Topic.findOne({_id:req.body.id});
    }else if (req.body.modal === "comment"){
      t = await Comment.findOne({_id:req.body.id});
    }
    let foundUser = false;
    //See if the user disliked
    for(let i = 0;i<t.dislikes.length;i++){
      if (t.dislikes[i].toString() === req.body.userID){
        t.dislikes.splice(i,1);
        t.likes.push(req.body.userID);
        foundUser = true;
        result = "like"
        break;
      }
    }
    if (!foundUser){
      //See if the user liked
      for(let i = 0;i<t.likes.length;i++){
        if (t.likes[i].toString() === req.body.userID){
          t.likes.splice(i,1);
          foundUser = true;
          result = "none";
          break;
        }
      }
    }
    if (!foundUser){
      let l = t.likes;
      l.push(req.body.userID);
      t.likes = l;
      result = "like"
    }
    t.save();
    res.send({result:result,likeCount:t.likes.length,dislikeCount:t.dislikes.length});
  })

  app.post("/addUserToDislikes", async(req,res) => {
    let t;
    if (req.body.modal === "post"){
      t = await Post.findOne({_id:req.body.id});
    }else if (req.body.modal === "topic"){
      t = await Topic.findOne({_id:req.body.id});
    }else if (req.body.modal === "comment"){
      t = await Comment.findOne({_id:req.body.id});
    }
    let result;
    let foundUser = false;
    //See if the user disliked
    for(let i = 0;i<t.dislikes.length;i++){
      if (t.dislikes[i].toString() === req.body.userID){
        t.dislikes.splice(i,1);
        foundUser = true;
        result = 'none';
        break;
      }
    }
    if (!foundUser){
      //See if the user liked
      for(let i = 0;i<t.likes.length;i++){
        if (t.likes[i].toString() === req.body.userID){
          t.likes.splice(i,1);
          t.dislikes.push(req.body.userID);
          foundUser = true;
          result = 'dislike';
          break;
        }
      }
    }
    if (!foundUser){
      let l = t.dislikes;
      l.push(req.body.userID);
      t.dislikes = l;
      result = 'dislike'
    }
    t.save();
    res.send({result:result,likeCount:t.likes.length,dislikeCount:t.dislikes.length});
  })

  app.post("/getLikesCounts",async(req,res) =>{
    let t;
    if (req.body.modal === "post"){
      t = await Post.findOne({_id:req.body.id});
    }else if (req.body.modal === "topic"){
      t = await Topic.findOne({_id:req.body.id});
    }else if (req.body.modal === "comment"){
      t = await Comment.findOne({_id:req.body.id});
    }

    res.send({likeCount:t.likes.length,dislikeCount:t.dislikes.length});
  })

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED' });
});
