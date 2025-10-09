import { render, screen } from "@testing-library/react";
import Home from "./page";

// Mock dependencies
jest.mock("@/components/auth/sign-in-with-google", () => ({
  __esModule: true,
  default: () => <button>Sign in with Google</button>,
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe("Home", () => {
  it("renders the welcome message", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText(/Welcome to/)).toBeInTheDocument();
    expect(
      screen.getByText("nextjs + zustand + firestore")
    ).toBeInTheDocument();
  });

  it("renders the description", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    expect(
      screen.getByText(
        /Experience seamless state management with Firestore as a temporary database/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This demo shows how Zustand stores can automatically sync with Firestore via Next.js Server Actions instead of localStorage/
      )
    ).toBeInTheDocument();
  });

  it("renders the sign-in component", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    const signInButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("renders the GitHub link in footer", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    const githubLink = screen.getByRole("link", { name: /view source code/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/Hiraqui/nextjs-zustand-firestore"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders GitHub icon in footer", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    const githubIcon = screen.getByAltText("GitHub icon");
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon).toHaveAttribute("src", "/github-mark.svg");
    expect(githubIcon).toHaveAttribute("width", "16");
    expect(githubIcon).toHaveAttribute("height", "16");
  });

  it("has correct project name styling in title", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    const projectName = screen.getByText("nextjs + zustand + firestore");
    expect(projectName).toHaveClass("text-primary");
  });
});
