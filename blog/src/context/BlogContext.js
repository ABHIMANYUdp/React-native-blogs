import React from "react";
import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

// this createContext will move the information from blog post provider to the blog list
const BlogContext = React.createContext();

const blogReducer = (state, action) => {
  switch (action.type) {
    case "delete_blogpost":
      return state.filter((blogPost) => blogPost.id !== action.payload);
    case "edit_blogpost":
      return state.map((blogPost) => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    case "get_blogposts":
      return action.payload;
    default:
      return state;
  }
};

const getBlogPosts = (dispatch) => {
  return async () => {
    const response = await jsonServer.get("/blogposts");

    dispatch({ type: "get_blogposts", payload: response.data });
  };
};

const addBlogPost = (dispatch) => {
  return async(title, content, callback) => {
    await jsonServer.post('/blogposts', {title, content})
    if (callback) {
      callback();
    }
  };
};

const deleteBlogPost = (dispatch) => {
  return async(id) => {
    await jsonServer.delete(`./blogposts/${id}`);
    dispatch({ type: "delete_blogpost", payload: id });
  };
};

const editBlogPost = (dispatch) => {
  return async(id, title, content, callback) => {
    await jsonServer.put(`/blogposts/${id}`, {title, content})
    dispatch({
      type: "edit_blogpost",
      payload: { id: id, title: title, content: content },
    });
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);
