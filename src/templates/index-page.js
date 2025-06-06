import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import BlogRoll from "../components/BlogRoll";
import { HTMLContent } from "../components/Content";

export const IndexPageTemplate = ({
    image,
    title,
    heading,
    subheading,
    mainpitch,
    description,
}) => {
    console.log(image);
    return (
        <div>
            <div
                className="full-width-image margin-top-0"
                style={{
                    // backgroundImage: `url(${
                    //     !!image.childImageSharp
                    //         ? image.childImageSharp.src
                    //         : image
                    // })`,
                    backgroundPosition: `top left`,
                    backgroundAttachment: `fixed`,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        height: "150px",
                        lineHeight: "1",
                        justifyContent: "space-around",
                        alignItems: "left",
                        flexDirection: "column",
                    }}
                >
                    <h1
                        className="has-text-weight-bold is-size-3-mobile is-size-2-tablet is-size-1-widescreen"
                        style={{
                            boxShadow:
                                "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                            backgroundColor: "rgb(255, 68, 0)",
                            color: "white",
                            lineHeight: "1",
                            padding: "0.25em",
                        }}
                    >
                        {title}
                    </h1>
                    <h3
                        className="has-text-weight-bold is-size-5-mobile is-size-5-tablet is-size-4-widescreen"
                        style={{
                            boxShadow:
                                "rgb(255, 68, 0) 0.5rem 0px 0px, rgb(255, 68, 0) -0.5rem 0px 0px",
                            backgroundColor: "rgb(255, 68, 0)",
                            color: "white",
                            lineHeight: "1",
                            padding: "0.25em",
                        }}
                    >
                        {subheading}
                    </h3>
                </div>
            </div>
            <section className="section section--gradient">
                <div className="container">
                    <div className="section">
                        <div className="columns">
                            <div className="column is-10 is-offset-1">
                                <div className="content">
                                    <div className="content">
                                        <div className="tile">
                                            <h1 className="title">
                                                {mainpitch.title}
                                            </h1>
                                        </div>
                                        <div className="tile">
                                            <h3 className="subtitle">
                                                {mainpitch.description}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column is-12">
                                            <h3 className="has-text-weight-semibold is-size-3">
                                                {heading}
                                            </h3>
                                            <HTMLContent
                                                content={description}
                                            />
                                        </div>
                                    </div>

                                    <div className="column is-12">
                                        <BlogRoll />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

IndexPageTemplate.propTypes = {
    image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    title: PropTypes.string,
    heading: PropTypes.string,
    subheading: PropTypes.string,
    mainpitch: PropTypes.object,
    description: PropTypes.string,
    intro: PropTypes.shape({
        blurbs: PropTypes.array,
    }),
};

const IndexPage = ({ data }) => {
    const { frontmatter } = data.markdownRemark;
    return (
        <Layout>
            <IndexPageTemplate
                image={frontmatter.image}
                title={frontmatter.title}
                heading={frontmatter.heading}
                subheading={frontmatter.subheading}
                mainpitch={frontmatter.mainpitch}
                description={data.markdownRemark.html}
                intro={frontmatter.intro}
            />
        </Layout>
    );
};

IndexPage.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.shape({
            frontmatter: PropTypes.object,
        }),
    }),
};

export default IndexPage;

export const pageQuery = graphql`
    query IndexPageTemplate {
        markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
            html
            frontmatter {
                title
                image {
                    childImageSharp {
                        gatsbyImageData(width: 2048)
                    }
                }
                heading
                subheading
                mainpitch {
                    title
                    description
                }
            }
        }
    }
`;
