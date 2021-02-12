import React, { Suspense, useCallback, useState } from "react"
import { Flex, Heading, Box, Button, IconButton } from "@chakra-ui/react"
import { useMutation } from "blitz"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import WrappedLink from "app/components/link"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"

const AuthenticatedLinks = ({ show }: { show: boolean }) => {
  const currentUser = useCurrentUser()

  if (!currentUser) {
    return null
  }

  const links = [
    {
      href: "/designs/generate",
      label: "Generate a Design",
    },
    {
      href: "/designs",
      label: "My Designs",
    },
    {
      href: "/orders",
      label: "My Orders",
    },
  ]

  return (
    <>
      <Box display={{ sm: show ? "block" : "none", md: "block" }} mt={{ base: 4, md: 0 }}>
        {links.map((link) => (
          <WrappedLink key={link.href} href={link.href} boxProps={{ mr: 5 }}>
            {link.label}
          </WrappedLink>
        ))}
      </Box>
    </>
  )
}

const LoginButtons = ({ onLogout, loggedIn }: { onLogout: () => void; loggedIn: boolean }) => {
  if (loggedIn) {
    return (
      <Button colorScheme="blue" onClick={onLogout} variant="link" size="lg">
        Logout
      </Button>
    )
  }

  return (
    <>
      <Button colorScheme="blue" variant="link" size="lg" mr={5}>
        <WrappedLink href="/login">Login</WrappedLink>
      </Button>
      <Button colorScheme="blue" variant="link" size="lg">
        <WrappedLink href="/signup">Signup</WrappedLink>
      </Button>
    </>
  )
}

const LoginButtonsWrapper = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  const handleLogout = useCallback(async () => {
    await logoutMutation()
  }, [logoutMutation])

  return <LoginButtons onLogout={handleLogout} loggedIn={currentUser ? true : false} />
}

const Navbar = () => {
  const [show, setShow] = useState(false)
  const handleToggle = () => setShow(!show)

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg="black"
      color="white"
      mb={10}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          Wearable Electronics Factory
        </Heading>
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <svg fill="white" width="12px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
        <WrappedLink href="/designs">Public Designs</WrappedLink>
      </Box>

      <Box display={{ sm: show ? "block" : "none", md: "flex" }} alignItems="center">
        <Suspense fallback={<div />}>
          <AuthenticatedLinks show={show} />
        </Suspense>

        <IconButton
          aria-label="View cart"
          icon={<FontAwesomeIcon icon={faShoppingCart} />}
          colorScheme="gray"
          variant="ghost"
          mr="1rem"
          _hover={{ background: "white", color: "black" }}
        />

        <Suspense fallback={<LoginButtons loggedIn={false} onLogout={() => {}} />}>
          <LoginButtonsWrapper />
        </Suspense>
      </Box>
    </Flex>
  )
}

export default Navbar
